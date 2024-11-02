import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class S3Object {
  constructor(obj) {
    Object.assign(this, obj);
  }

  @Field()
  preSignedUrl: string;
}
