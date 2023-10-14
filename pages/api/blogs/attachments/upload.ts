import { generateClientTokenFromReadWriteToken, handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionMiddleware } from '$servers/middlewares';
import { appServerConfig } from '$configs/servers/app.server.config';
import { prismaClient } from '$servers/prisma-client';
import { HTTP_METHOD } from '$clients/http-client';
import { APIResponse } from '$dto/api';

type TokenPayload = {
  blogId: number;
};

const handleGenerateClientToken = async (
  body: Extract<HandleUploadBody, { type: 'blob.generate-client-token' }>
): Promise<ReturnType<typeof handleUpload>> => {
  const clientToken = await generateClientTokenFromReadWriteToken({
    allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/svg'],
    token: appServerConfig.VERCEL_BLOB_RW_TOKEN,
    pathname: body.payload.pathname,
    /**
     * @note We will call the callback (onUploadComplete) manually
     */
    onUploadCompleted: undefined,
    validUntil: new Date(new Date().getTime() + 30 * 1000).getTime(),
    maximumSizeInBytes: 5000000,
  });

  return {
    type: body.type,
    clientToken,
  };
};

const handleUploadCallback = async ({
  payload,
}: Extract<HandleUploadBody, { type: 'blob.upload-completed' }>): Promise<APIResponse.UploadCallbackResponse> => {
  const { blob } = payload;
  const tokenPayload: TokenPayload = JSON.parse(payload.tokenPayload!);
  const attachment = await prismaClient.attachment.create({
    data: {
      key: blob.url,
      filename: blob.pathname,
      blogId: tokenPayload.blogId,
      metadata: {
        contentType: blob.contentType,
        contentDisposition: blob.contentDisposition,
      },
    },
  });

  return {
    message: 'OK',
    data: {
      attachmentId: attachment.id,
    },
  };
};

export async function post(request: NextApiRequest, response: NextApiResponse) {
  const body = JSON.parse(request.body) as HandleUploadBody;

  switch (body.type) {
    case 'blob.generate-client-token':
      return response.status(200).json(await handleGenerateClientToken(body));
    case 'blob.upload-completed':
      return response.status(200).json(await handleUploadCallback(body));
    default:
      return response.status(400).json({ message: 'Invalid event type' });
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method?.toUpperCase()) {
      case HTTP_METHOD.POST:
        return await post(req, res);
      default:
        return res.status(404).send('not implemented');
    }
  } catch (err) {
    return res.status(400).json({ message: (err as Error).message });
  }
}

export default withSessionMiddleware(handler);
