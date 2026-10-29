import Foundation

/// Modern Compatibility Layer #4:
/// Apple Store Legacy Acquisition & Downgrade Client (iOS 9.0+ NSURLSessionDataTask backport)
public final class StoreClientLegacyBuy {
    public static let shared = StoreClientLegacyBuy()
    public let session: URLSession

    public init() {
        let config = URLSessionConfiguration.default
        config.httpCookieAcceptPolicy = .always
        self.session = URLSession(configuration: config)
    }

    public func searchApps(term: String, country: String = "om", completion: @escaping ([[String: Any]]) -> Void) {
        let escaped = term.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "YouTube"
        guard let url = URL(string: "https://itunes.apple.com/search?term=\(escaped)&country=\(country)&entity=software&limit=50") else {
            completion([])
            return
        }
        let task = session.dataTask(with: url) { data, _, _ in
            guard let data = data,
                  let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let results = json["results"] as? [[String: Any]] else {
                DispatchQueue.main.async { completion([]) }
                return
            }
            DispatchQueue.main.async { completion(results) }
        }
        task.resume()
    }

    public func buildDownloadPayload(
        salableAdamId: String,
        externalVersionId: String?,
        guid: String,
        dsid: String
    ) -> [String: Any] {
        var payload: [String: Any] = [
            "creditDisplay": "",
            "guid": guid.uppercased(),
            "salableAdamId": salableAdamId,
            "ownerDsid": dsid
        ]
        if let extId = externalVersionId, !extId.isEmpty {
            payload["externalVersionId"] = extId
        }
        return payload
    }
}
