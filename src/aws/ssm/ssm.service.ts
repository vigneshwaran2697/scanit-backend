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

  public static async updateParams() {
    try {
      const data = await this.getParamFromAws(config.appConfig);
      
      if (data) {
        process.env.config = JSON.stringify(data);
        config['appConfig'] = data;
      }

      const dbData = await this.getParamFromAws(config.dbParamName);
      if (dbData) {
        process.env.config = JSON.stringify(dbData);
        config['dbConfig'] = dbData;
      }
      console.log(
        `config region is ********************: ${config.region}`,
        SsmService.name,
      );
    } catch (err) {
      console.log(`Error fetching params from AWS: ${err}`, SsmService.name);
    }
  }

  public static async getParamFromAws(paramName) {
    try{
      const ssmClient = new AWS.SSM({
        region: config.region,
      });
      const data = await ssmClient
        .getParameter({
          Name: paramName,
          WithDecryption: true,
        })
        .promise();
      console.log(data);
      return JSON.parse(data.Parameter.Value);
    } catch (err) {
       console.log('Error in fetching data from SSM');
    }
  }
}
