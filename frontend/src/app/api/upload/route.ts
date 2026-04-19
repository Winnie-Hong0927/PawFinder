import { NextRequest, NextResponse } from "next/server";
import { S3Storage } from "coze-coding-dev-sdk";

const storage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
  bucketName: process.env.COZE_BUCKET_NAME,
  region: "cn-beijing",
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "请选择要上传的文件" },
        { status: 400 }
      );
    }

    // 验证文件类型
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "只支持 JPG、PNG、GIF、WebP 格式的图片" },
        { status: 400 }
      );
    }

    // 验证文件大小 (最大 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "图片大小不能超过 5MB" },
        { status: 400 }
      );
    }

    // 转换文件为 Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 上传文件
    const fileKey = await storage.uploadFile({
      fileContent: buffer,
      fileName: `pets/${Date.now()}_${file.name}`,
      contentType: file.type,
    });

    // 生成可访问的签名 URL
    const url = await storage.generatePresignedUrl({
      key: fileKey,
      expireTime: 86400 * 7, // 7 天有效期
    });

    return NextResponse.json({
      success: true,
      key: fileKey,
      url: url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "上传失败，请重试" },
      { status: 500 }
    );
  }
}
