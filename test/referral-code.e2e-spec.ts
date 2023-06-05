import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ResponseStatus } from '../src/module/basic/basic.dto';

const userId = 1;

describe('Referral Code controller (e2e)', () => {
  let app: INestApplication;
  // create an attribute to save list function to reuse in other tests
  const functions: {
    [key: string]: (...args: any[]) => Promise<request.Response>;
  } = {};

  beforeAll(async () => {
    // set test environment to select test database

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(80);
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  it('should create referral code success and NOT create redundant referral code', async () => {
    functions.getByUserId = async (userId) => {
      return await request(app.getHttpServer())
        .get(`/referral-code/get-by-user-id/${userId}`)
        .set('Accept', 'application/json');
    };
    const response = await functions.getByUserId(userId);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(1000);
    expect(response.body.data.result).toHaveProperty('code');

    const firstCode = response.body.data.result.code;

    const responseTwice = await functions.getByUserId(userId);
    expect(responseTwice.status).toBe(200);
    expect(responseTwice.body.status).toBe(1000);
    expect(responseTwice.body.data.result).toHaveProperty('code');
    expect(responseTwice.body.data.result.code).toBe(firstCode);
  });

  describe('check new referral code', () => {
    functions.checkNewReferralCodeValid = async (newCode: string) => {
      return await request(app.getHttpServer())
        .get(`/referral-code/check-new-referral-code/${newCode}`)
        .set('Accept', 'application/json');
    };

    it('should return success when referral code is not existed', async () => {
      const response = await functions.checkNewReferralCodeValid('XXXXXXXX');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(ResponseStatus.SUCCESS);
    });

    it('should return false when referral code existed', async () => {
      const response = await functions.getByUserId(userId);
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(1000);
      expect(response.body.data.result).toHaveProperty('code');
      const existCode = response.body.data.result.code;

      const response1 = await functions.checkNewReferralCodeValid(existCode);
      expect(response1.status).toBe(200);
      expect(response1.body.status).toBe(ResponseStatus.FAIL);
    });

    it('should return false when referral code format is invalid', async () => {
      const response = await functions.checkNewReferralCodeValid('12');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(ResponseStatus.FAIL);

      const response1 = await functions.checkNewReferralCodeValid(
        '123456789012345678901234567890123456789012345678901',
      );
      expect(response1.status).toBe(200);
      expect(response1.body.status).toBe(ResponseStatus.FAIL);

      const response2 = await functions.checkNewReferralCodeValid('*123456*');
      expect(response2.status).toBe(200);
      expect(response2.body.status).toBe(ResponseStatus.FAIL);
    });
  });
});
