import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ResponseStatus } from '../src/module/basic/basic.dto';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

const userId = 1;
const referralUserId = 2;

describe('Commission controller (e2e)', () => {
  let app: INestApplication;
  // create an attribute to save list function to reuse in other tests
  const funcs: {
    [key: string]: (...args: any[]) => Promise<request.Response>;
  } = {};

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(90);
  });

  afterAll(async () => {
    // clear database after all test
    await (app.get(getConnectionToken()) as Connection).db.dropDatabase();

    await Promise.all([app.close()]);
  });

  it('should log commission', async () => {
    funcs.getByUserId = async (userId) => {
      return await request(app.getHttpServer())
        .get(`/referral-code/get-by-user-id/${userId}`)
        .set('Accept', 'application/json');
    };

    funcs.connect = async (referralCode, referralUserId) => {
      return await request(app.getHttpServer())
        .post('/referral-user/connect')
        .send({
          referralCode,
          referralUserId,
        })
        .set('Accept', 'application/json');
    };

    funcs.accounting = async (userId, amount, txId) => {
      return await request(app.getHttpServer())
        .post('/commission/accounting')
        .send({
          uId: userId,
          transactionType: 'TOP_UP',
          transaction: {
            id: txId,
            amount,
          },
          createdAt: new Date(),
        })
        .set('Accept', 'application/json');
    };

    funcs.getCommissionListByUserId = async (userId) => {
      return await request(app.getHttpServer())
        .get(`/commission/${userId}`)
        .set('Accept', 'application/json');
    };

    // Get refer code
    const response = await funcs.getByUserId(userId);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(1000);
    expect(response.body.data.result).toHaveProperty('code');
    const code = response.body.data.result.code;

    // Connect referral user
    const responseConnect = await funcs.connect(code, referralUserId);
    expect(responseConnect.status).toBe(201);
    expect(responseConnect.body.status).toBe(ResponseStatus.SUCCESS);

    // Accounting
    const txId = 'txId_' + new Date().getTime();
    const amount = 1000000;
    const responseAccounting = await funcs.accounting(
      referralUserId,
      amount,
      txId,
    );

    expect(responseAccounting.status).toBe(201);
    expect(responseAccounting.body.status).toBe(ResponseStatus.SUCCESS);
    expect(responseAccounting.body.data.result.amount).toBe(amount);
    expect(responseAccounting.body.data.result.tx.id).toBe(txId);
    expect(responseAccounting.body.data.result.status).toBe('ESTIMATE');
    expect(responseAccounting.body.data.result.txType).toBe('TOP_UP');
    expect(responseAccounting.body.data.result.paymentStatus).toBe('PENDING');

    // Get commission list by user id
    const responseCommission = await funcs.getCommissionListByUserId(userId);
    expect(responseCommission.status).toBe(200);
    expect(responseCommission.body.status).toBe(ResponseStatus.SUCCESS);
    expect(responseCommission.body.data.length).toBeGreaterThan(0);
    expect(
      responseCommission.body.data?.filter((m) => m.tx.id === txId).length,
    ).toBe(1);
  });
});
