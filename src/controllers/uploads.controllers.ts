import { Request, Response } from "express";
import https from "https"; // Add this line

import FormData from "form-data";
import path from "path";

export async function upload(req: Request, res: Response): Promise<Response> {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }
    if (req.file.size > 20 * 1024 * 1024) {
      return res
        .status(400)
        .json({ message: "File size should be less than 20MB" });
    }
    const token = String(process.env.BOT_TOKEN || "");
    if (!token) {
      return res.status(500).json({ message: "Provide BOT_TOKEN" });
    }
    const chatId = String(process.env.CHANNEL_ID || "");
    if (!chatId) {
      return res.status(500).json({ message: "Provide CHAT_ID" });
    }
    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append("document", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    const data = await new Promise(
      (resolve: (v: any) => void, reject: (e: any) => void) => {
        formData.submit(
          `https://api.telegram.org/bot${token}/sendDocument`,
          (err: any, r: any) => {
            if (err) {
              reject(err);
            }
            let data = "";
            r.on("data", (chunk: any) => {
              data += chunk;
            });
            r.on("end", () => {
              resolve(JSON.parse(data));
            });
            r.resume();
          }
        );
      }
    );
    if (!data.ok) {
      return res.status(500).json({ message: data.description });
    }
    const { file_id } = data.result.document;
    return res.status(200).json({ file_id });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function download(req: Request, res: Response) {
  try {
    const token = String(process.env.BOT_TOKEN || "");
    if (!token) {
      return res.status(500).json({ message: "Provide BOT_TOKEN" });
    }

    const { file_id } = req.params;
    if (!file_id) {
      return res.status(400).json({ message: "File ID is required" });
    }

    const getFilePath = () => {
      return new Promise<{ file_path: string }>((resolve, reject) => {
        https
          .get(
            `https://api.telegram.org/bot${token}/getFile?file_id=${file_id}`,
            (response) => {
              let data = "";
              response.on("data", (chunk) => {
                data += chunk;
              });
              response.on("end", () => {
                if (response.statusCode !== 200) {
                  return reject(
                    new Error(
                      `Failed to get the file path from Telegram. Status: ${response.statusCode}`
                    )
                  );
                }
                const jsonResponse = JSON.parse(data);
                if (jsonResponse.ok) {
                  resolve({ file_path: jsonResponse.result.file_path });
                } else {
                  reject(
                    new Error("Failed to get the file path from Telegram.")
                  );
                }
              });
            }
          )
          .on("error", (error) => {
            reject(error);
          });
      });
    };

    const fetchFile = (file_path: string) => {
      return new Promise<void>((resolve, reject) => {
        const filename = path.basename(file_path);
        https
          .get(
            `https://api.telegram.org/file/bot${token}/${file_path}`,
            (fileResponse: any) => {
              if (fileResponse.statusCode !== 200) {
                return reject(
                  new Error(
                    `Failed to fetch the file. Status: ${fileResponse.statusCode}`
                  )
                );
              }

              res.setHeader(
                "Content-Disposition",
                `attachment; filename="${filename}"`
              );
              res.setHeader(
                "Content-Type",
                fileResponse.headers["content-type"] ||
                  "application/octet-stream"
              );

              fileResponse.pipe(res);
              resolve();
            }
          )
          .on("error", (error: any) => {
            reject(error);
          });
      });
    };

    const { file_path } = await getFilePath();
    await fetchFile(file_path);
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}
