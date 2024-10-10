import archiver from 'archiver';
import { KeyValueStore, log } from 'crawlee';
import fs from 'fs';
import mime from 'mime';

const archiveFilePath = `./archive.zip`;

export const archiveKVS = async (store: KeyValueStore) => {
    let archive = archiver('zip', {
        zlib: { level: 9 }
    });

    archive.on('error', (err) => {
        throw err;
    });

    const output: any = fs.createWriteStream(archiveFilePath);

    output.on('close', () => {
        log.info('Archive has been written');
    });

    archive.pipe(output);

    await store.forEachKey(async (key) => {
        const { buffer, contentType } = (await store.getValue(key)) as { buffer: Buffer | string; contentType: string };
        const extension = mime.getExtension(contentType);

        archive.append(Buffer.from(buffer), { name: `${key}.${extension}` });
    });

    await archive.finalize();

    return fs.createReadStream(archiveFilePath);
}

export const deleteArchiveFile = async () => {
    try {
        fs.unlinkSync(archiveFilePath);
    } catch (err) {
        log.error(`Error while deleting archive file ${(err as Error).message}`);
    }
}
