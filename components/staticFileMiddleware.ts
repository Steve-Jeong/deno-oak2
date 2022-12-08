import { Context, send } from 'https://deno.land/x/oak/mod.ts'

export const staticFileMiddleware = async (ctx: Context, next: Function) => {
  const path = `${Deno.cwd()}/public${ctx.request.url.pathname}`
  console.log('path : ', path);
  console.log('ctx.request.url.pathname : ', ctx.request.url.pathname);

  const fileExistsFlag = await fileExists(path)
  console.log('fileExistsFlag : ', fileExistsFlag);
  if (fileExistsFlag) {
    await send(ctx, ctx.request.url.pathname, {
      root: `${Deno.cwd()}/public`
    })
  } else {
    await next()
  }
}

async function fileExists(path: string) {
  try {
    const stats = await Deno.lstat(path)
    console.log('stats : ', stats);
    if (stats) console.log('stats.isFile : ', stats.isFile);
    return stats && stats.isFile
  } catch (e) {
    if (e && e instanceof Deno.errors.NotFound) {
      return false
    } else {
      throw e
    }
  }
}