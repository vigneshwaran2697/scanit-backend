import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { config as configData } from '../../config/config';

const config = configData[process.env.NODE_ENV || 'development'];

@Injectable()
export class SsmService {
  public static async getInstance() {
    await SsmService.updateParams();
    return new SsmService();
  }

  public static async getDbConfigFromAws() {
    return this.getParamFromAws(config.dbParamName);
  }

  public static async getMailConfigFromAws() {
    return this.getParamFromAws(config.mailParamName);
  }

  public static async updateParams() {
    const data = await this.getParamFromAws(config.cognitoParamName);
    if (data) {
      process.env.config = JSON.stringify(data);
      config['appConfig'] = data;
    }
    const dbData = await this.getParamFromAws(config.dbParamName);
    if (dbData) {
      process.env.config = JSON.stringify(dbData);
      config['dbConfig'] = dbData;
    }
    const mailData = await this.getParamFromAws(config.mailParamName);
    if (mailData) {
      process.env.config = JSON.stringify(mailData);
      config['mailConfig'] = mailData;
    }
    const twilioData = await this.getParamFromAws(config.twilioParamName);
    if (twilioData) {
      process.env.config = JSON.stringify(twilioData);
      config['twilioConfig'] = twilioData;
    }
    const ediData = await this.getParamFromAws(config.ediParamName);
    if (ediData) {
      process.env.config = JSON.stringify(ediData);
      config['ediConfig'] = ediData;
    }
    const clientData = await this.getParamFromAws(config.clientParamName);
    if (clientData) {
      process.env.config = JSON.stringify(clientData);
      config['clientConfig'] = clientData;
    }
    console.log(
      `config region is ********************: ${config.region}`,
      SsmService.name,
    );
  }

  public static async getParamFromAws(paramName) {
    const ssmClient = new AWS.SSM({
      region: config.region,
    });
    const data = await ssmClient
      .getParameter({
        Name: paramName,
        WithDecryption: true,
      })
      .promise();
    return JSON.parse(data.Parameter.Value);
  }
}
