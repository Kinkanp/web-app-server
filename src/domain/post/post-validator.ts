import { Validator } from '../../common/validation';
import { CreatePostParams, UpdatePostParams } from './post.models';
import { injectable } from 'inversify';
import { JSONSchemaType } from 'ajv';
import { Post } from './post.entity';

@injectable()
export class PostValidator {
  private schemas = {
    create: 'createPostSchema',
    update: 'updatePostSchema',
  };
  private properties = {
    text: { type: 'string' as const, maxLength: 300, minLength: 15 }
  };

  constructor() {
    this.setCreateSchema();
    this.setEditSchema();
  }

  public validateCreate(params: CreatePostParams): void {
    Validator.validate<CreatePostParams>(this.schemas.create, params)
  }

  public validateUpdate(params: UpdatePostParams): void {
    Validator.validate<UpdatePostParams>(this.schemas.update, params)
  }

  private setCreateSchema(): void {
    Validator.registerSchema<CreatePostParams>(
      {
        type: 'object',
        properties: {
          text: this.properties.text,
          authorId: { type: 'integer', }
        },
        required: ['text', 'authorId'],
        additionalProperties: false
      },
      this.schemas.create
    );
  }

  private setEditSchema(): void {
    Validator.registerSchema<UpdatePostParams>(
      {
        type: 'object',
        properties: { text: this.properties.text },
        required: ['text'],
        additionalProperties: false
      },
      this.schemas.update
    );
  }
}
