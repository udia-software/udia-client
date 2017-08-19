import { post } from "../baseApi";

export function getPresignedUrl(filename, mimetype) {
  return post("/s3/sign", {
    filename: filename,
    mimetype: mimetype
  });
}