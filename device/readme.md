combinedHash = (await node.object.patch.addLink(combinedHash, { cid: new IPFS.CID(latestSingleItemHash) })).toString()
