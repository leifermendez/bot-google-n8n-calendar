import ffmpeg from "fluent-ffmpeg";
import {join} from "path";
import {tmpdir} from "os";
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
ffmpeg.setFfmpegPath(ffmpegPath);

const convertOggMp3 = async (inputStream: string, outStream: string) => {
    return new Promise((resolve) => {
        ffmpeg(inputStream)
            .audioQuality(96)
            .toFormat("mp3")
            .save(outStream)
            .on("progress", () => null)
            .on("end", () => {
                resolve(true);
            });
    });
};

/**
 * Return mp3 path
 */
export const processAudio =  async (pathOgg: string ) => {
    const pathTmpMp3 = join(tmpdir(),`voice-note-${Date.now()}.mp3`);
    await convertOggMp3(pathOgg, pathTmpMp3);
    return pathTmpMp3
}