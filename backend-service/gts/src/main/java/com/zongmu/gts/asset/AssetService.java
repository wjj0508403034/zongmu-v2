package com.zongmu.gts.asset;

import java.util.List;

import com.zongmu.gts.asset.controller.CreateAssetParam;
import com.zongmu.gts.core.BusinessException;

public interface AssetService {

	List<Asset> query();

	Asset save(CreateAssetParam createAssetParam) throws BusinessException;

	AssetFile attchFile(String assetNo, AssetFile assetFile)
			throws BusinessException;

	AssetTag createTag(AssetTag assetTag) throws BusinessException;

	AssetTag batchAddTagItems(Long assetTagId, List<String> tagItems)
			throws BusinessException;

	List<AssetTag> findAllTags() throws BusinessException;
}