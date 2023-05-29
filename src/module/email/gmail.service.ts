import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { SendEmailDto } from './dto/send-email.dto';
import { join } from 'path';
import { existsSync } from 'fs';
import { StepResult } from '../basic/basic.dto';

// This service can impersonate as any other user in organization (google workspace)
const emailImpersonate = 'support@ads-pro.site';
const keyPath = 'secret/google-service-account-key.json';

const SCOPES = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send',
];

@Injectable()
export class GmailService {
  /**
   * Note: dto.fromEmail is not used, it was fixed to emailImpersonate
   * This is related to the key file, which is generated for a specific google workspace users
   * Please read `Delegating domain-wide authority to the service account` section in README.md
   * @param dto
   * @returns
   */
  async send(dto: SendEmailDto): Promise<StepResult> {
    try {
      const result = await this._send(dto);
      return {
        isSuccess: true,
        data: result,
      };
    } catch (e) {
      return {
        isSuccess: false,
        message: e.message,
      };
    }
  }

  private async _send(dto: SendEmailDto) {
    const gmail = await this.getAuth();

    const { toName, toEmail, subject, htmlBody, fromName } = dto;

    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString(
      'base64',
    )}?=`;

    const messageParts = [
      `From: ${fromName} <${emailImpersonate}>`,
      `To: ${toName} <${toEmail}>`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
      htmlBody,
    ];

    const message = messageParts.join('\n');

    // The body needs to be base64url encoded.
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const res = await gmail.users.messages.send({
      userId: 'me',
      alt: 'json',
      requestBody: {
        raw: encodedMessage,
      },
    });

    return res.data;
  }

  private async getAuth() {
    const keyFile = join(process.cwd(), keyPath);

    // check if key file exists
    if (!existsSync(keyFile)) {
      throw new Error(
        `Key file not found. Please put the key file at ${keyPath}`,
      );
    }

    const JWT = google.auth.JWT;
    const authClient = new JWT({
      keyFile,
      scopes: SCOPES,
      subject: emailImpersonate,
    });

    await authClient.authorize(); // once authorized, can do whatever you want

    const gmail = google.gmail({
      auth: authClient,
      version: 'v1',
    });

    return gmail;
  }
}
