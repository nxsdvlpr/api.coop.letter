import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { UserContext } from '../auth.interfaces';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    if (context.getType<GqlContextType>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context);

      return ctx.getContext<UserContext>().req.user;
    } else if (context.getType() === 'http') {
      return context.switchToHttp().getRequest().user;
    }
  },
);
