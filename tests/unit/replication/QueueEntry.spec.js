'use strict'; // eslint-disable-line

const assert = require('assert');

const QueueEntry =
          require('../../../extensions/replication/utils/QueueEntry');

describe('QueueEntry helper class', () => {
    describe('built from Kafka queue entry', () => {
        /* eslint-disable max-len */
        const kafkaEntry = {
            key: 'foo',
            value: '{"type":"put","bucket":"queue-populator-test-bucket","key":"hosts\\u000098500086134471999999RG001  0","value":"{\\"md-model-version\\":2,\\"owner-display-name\\":\\"Bart\\",\\"owner-id\\":\\"79a59df900b949e55d96a1e698fbacedfd6e09d98eacf8f8d5218e7cd47ef2be\\",\\"content-length\\":542,\\"content-type\\":\\"text/plain\\",\\"last-modified\\":\\"2017-07-13T02:44:25.519Z\\",\\"content-md5\\":\\"01064f35c238bd2b785e34508c3d27f4\\",\\"x-amz-version-id\\":\\"null\\",\\"x-amz-server-version-id\\":\\"\\",\\"x-amz-storage-class\\":\\"STANDARD\\",\\"x-amz-server-side-encryption\\":\\"\\",\\"x-amz-server-side-encryption-aws-kms-key-id\\":\\"\\",\\"x-amz-server-side-encryption-customer-algorithm\\":\\"\\",\\"x-amz-website-redirect-location\\":\\"\\",\\"acl\\":{\\"Canned\\":\\"private\\",\\"FULL_CONTROL\\":[],\\"WRITE_ACP\\":[],\\"READ\\":[],\\"READ_ACP\\":[]},\\"key\\":\\"\\",\\"location\\":[{\\"key\\":\\"29258f299ddfd65f6108e6cd7bd2aea9fbe7e9e0\\",\\"size\\":542,\\"start\\":0,\\"dataStoreName\\":\\"file\\"}],\\"isDeleteMarker\\":false,\\"tags\\":{},\\"replicationInfo\\":{\\"status\\":\\"PENDING\\",\\"content\\":[\\"DATA\\",\\"METADATA\\"],\\"destination\\":\\"arn:aws:s3:::dummy-dest-bucket\\",\\"storageClass\\":\\"STANDARD\\",\\"role\\":\\"arn:aws:iam::123456789012:role/backbeat\\"},\\"x-amz-meta-s3cmd-attrs\\":\\"uid:0/gname:root/uname:root/gid:0/mode:33188/mtime:1490807629/atime:1499845478/md5:01064f35c238bd2b785e34508c3d27f4/ctime:1490807629\\",\\"versionId\\":\\"98500086134471999999RG001  0\\"}"}',
        };
        /* eslint-enable max-len */

        it('should parse a well-formed kafka entry', () => {
            const entry = QueueEntry.createFromKafkaEntry(kafkaEntry);
            assert.strictEqual(entry.error, undefined);
            assert.strictEqual(entry.getBucket(),
                               'queue-populator-test-bucket');
            assert.strictEqual(entry.getObjectKey(), 'hosts');
            assert.strictEqual(entry.getVersionId(),
                               '98500086134471999999RG001  0');
            assert.strictEqual(
                entry.getEncodedVersionId(),
                '39383530303038363133343437313939393939395247303031202030');
            assert.strictEqual(entry.getContentLength(), 542);
            assert.strictEqual(entry.getContentMD5(),
                               '01064f35c238bd2b785e34508c3d27f4');
            assert.strictEqual(entry.getReplicationStatus(), 'PENDING');
            const repContent = entry.getReplicationContent();
            assert.deepStrictEqual(repContent, ['DATA', 'METADATA']);
            const destBucket = entry.getReplicationDestBucket();
            assert.deepStrictEqual(destBucket, 'dummy-dest-bucket');
        });

        it('should convert a kafka entry\'s replication status', () => {
            const entry = QueueEntry.createFromKafkaEntry(kafkaEntry);
            assert.strictEqual(entry.error, undefined);

            const replica = entry.toReplicaEntry();
            assert.strictEqual(replica.getReplicationStatus(), 'REPLICA');

            const completed = entry.toCompletedEntry();
            assert.strictEqual(completed.getReplicationStatus(), 'COMPLETED');
        });
    });
});
