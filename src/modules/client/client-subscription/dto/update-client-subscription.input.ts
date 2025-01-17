import { CreateClientSubscriptionInput } from './create-client-subscription.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateClientSubscriptionInput extends PartialType(CreateClientSubscriptionInput) {
  id: number;
}
