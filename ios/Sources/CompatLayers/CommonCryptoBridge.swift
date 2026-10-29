import Foundation
import CommonCrypto

/// Modern Compatibility Layer #1:
/// Drop-in replacement for iOS 13+ CryptoKit SHA256 & HMAC<SHA256> supporting iOS 9.0+ (armv7 & arm64)
public enum DLiPACryptoCompat {
    public static func sha256Hex(_ data: Data) -> String {
        var digest = [UInt8](repeating: 0, count: Int(CC_SHA256_DIGEST_LENGTH))
        data.withUnsafeBytes { rawBuffer in
            _ = CC_SHA256(rawBuffer.baseAddress, CC_LONG(data.count), &digest)
        }
        return digest.map { String(format: "%02x", $0) }.joined()
    }

    public static func hmacSHA256(key: Data, message: Data) -> Data {
        var mac = [UInt8](repeating: 0, count: Int(CC_SHA256_DIGEST_LENGTH))
        key.withUnsafeBytes { keyBytes in
            message.withUnsafeBytes { msgBytes in
                CCHmac(
                    CCHmacAlgorithm(kCCHmacAlgSHA256),
                    keyBytes.baseAddress,
                    key.count,
                    msgBytes.baseAddress,
                    message.count,
                    &mac
                )
            }
        }
        return Data(mac)
    }
}
