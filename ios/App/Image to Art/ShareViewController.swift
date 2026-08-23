//
//  ShareViewController.swift
//  Image to Art
//
//  Created by Aleksandr Dederer on 02/08/26.
//

import UIKit
import MobileCoreServices
import UniformTypeIdentifiers

class ShareViewController: UIViewController {
    let APP_GROUP_ID = "group.com.imagetoart.app"

    override func viewDidLoad() {
        super.viewDidLoad()
        print("[ShareExtension] ShareViewController viewDidLoad called")
        processSharedContent()
    }

    private func processSharedContent() {
        guard let extensionContext = self.extensionContext,
              let inputItems = extensionContext.inputItems as? [NSExtensionItem] else {
            print("[ShareExtension] No extensionContext or inputItems found")
            extensionContext?.completeRequest(returningItems: [], completionHandler: nil)
            return
        }

        print("[ShareExtension] Found \(inputItems.count) input items")
        var files: [[String: Any]] = []
        var title = ""

        let dispatchGroup = DispatchGroup()

        for (itemIndex, item) in inputItems.enumerated() {
            if let itemTitle = item.attributedTitle?.string {
                title = itemTitle
                print("[ShareExtension] Item \(itemIndex) title: \(title)")
            }

            guard let attachments = item.attachments else {
                print("[ShareExtension] Item \(itemIndex) has no attachments")
                continue
            }

            print("[ShareExtension] Item \(itemIndex) has \(attachments.count) attachments")

            for (attIndex, provider) in attachments.enumerated() {
                print("[ShareExtension] Attachment \(attIndex) registered type identifiers: \(provider.registeredTypeIdentifiers)")
                
                let typeId = UTType.image.identifier
                let legacyTypeId = kUTTypeImage as String
                
                if provider.hasItemConformingToTypeIdentifier(typeId) || provider.hasItemConformingToTypeIdentifier(legacyTypeId) {
                    dispatchGroup.enter()
                    let targetTypeId = provider.hasItemConformingToTypeIdentifier(typeId) ? typeId : legacyTypeId
                    print("[ShareExtension] Loading data representation for type: \(targetTypeId)")
                    
                    provider.loadDataRepresentation(forTypeIdentifier: targetTypeId) { (data, error) in
                        defer { dispatchGroup.leave() }
                        
                        if let error = error {
                            print("[ShareExtension] Error loading data representation: \(error.localizedDescription)")
                            return
                        }
                        
                        guard let data = data else {
                            print("[ShareExtension] Loaded data is nil")
                            return
                        }
                        
                        print("[ShareExtension] Loaded data size: \(data.count) bytes")

                        if let sharedContainer = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: self.APP_GROUP_ID) {
                            let fileName = "shared_image_\(UUID().uuidString).jpg"
                            let destURL = sharedContainer.appendingPathComponent(fileName)
                            
                            do {
                                if let image = UIImage(data: data), let jpegData = image.jpegData(compressionQuality: 0.92) {
                                    try jpegData.write(to: destURL)
                                } else {
                                    try data.write(to: destURL)
                                }
                                
                                print("[ShareExtension] Successfully saved shared image to: \(destURL.path)")
                                
                                let fileDict: [String: Any] = [
                                    "uri": destURL.absoluteString,
                                    "name": fileName,
                                    "mimeType": "image/jpeg"
                                ]
                                files.append(fileDict)
                            } catch {
                                print("[ShareExtension] Failed to write shared image file: \(error.localizedDescription)")
                            }
                        } else {
                            print("[ShareExtension] ERROR: Could not access shared container URL for app group: \(self.APP_GROUP_ID)")
                        }
                    }
                } else {
                    print("[ShareExtension] Attachment \(attIndex) does not conform to image type identifiers")
                }
            }
        }

        dispatchGroup.notify(queue: .main) {
            print("[ShareExtension] All attachments processed. Total files: \(files.count)")
            
            let shareData: [String: Any] = [
                "title": title,
                "texts": [],
                "files": files
            ]

            if let userDefaults = UserDefaults(suiteName: self.APP_GROUP_ID) {
                userDefaults.set(shareData, forKey: "share-target-data")
                userDefaults.synchronize()
                print("[ShareExtension] Saved share data to UserDefaults successfully under suite: \(self.APP_GROUP_ID)")
            } else {
                print("[ShareExtension] ERROR: Failed to initialize UserDefaults with suiteName: \(self.APP_GROUP_ID)")
            }

            self.redirectToHostApp()
            extensionContext.completeRequest(returningItems: [], completionHandler: nil)
        }
    }

    private func redirectToHostApp() {
        if let url = URL(string: "com.imagetoart.app://share") {
            print("[ShareExtension] Attempting to open host app via URL: \(url.absoluteString)")
            self.extensionContext?.open(url, completionHandler: { success in
                print("[ShareExtension] Open host app result: \(success)")
            })
        }
    }
}
