import { Injectable } from '@nestjs/common';
import { SES } from 'aws-sdk';

@Injectable()
export class SesService {
    private ses: SES;

    constructor() {
        this.ses = new SES();
    }

    public async sendEmail(to: string, subject: string, body: string): Promise<void> {
        const params: SES.SendEmailRequest = {
            Source: 'teamscanit@idcheck.co.in', // Replace with your SES verified email address
            Destination: {
                ToAddresses: [to],
            },
            Message: {
                Subject: {
                    Data: subject,
                },
                Body: {
                    Text: {
                        Data: body,
                    },
                },
            },
        };

        try {
            await this.ses.sendEmail(params).promise();
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email');
        }
    }
}
