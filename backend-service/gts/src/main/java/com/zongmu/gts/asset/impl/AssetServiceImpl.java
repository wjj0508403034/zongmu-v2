package com.zongmu.gts.asset.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.google.common.collect.Lists;
import com.zongmu.gts.asset.Asset;
import com.zongmu.gts.asset.AssetFile;
import com.zongmu.gts.asset.AssetService;
import com.zongmu.gts.asset.AssetTag;
import com.zongmu.gts.asset.AssetTagItem;
import com.zongmu.gts.asset.controller.CreateAssetParam;
import com.zongmu.gts.asset.repositories.AssetFileRepo;
import com.zongmu.gts.asset.repositories.AssetRepo;
import com.zongmu.gts.asset.repositories.AssetTagItemRepo;
import com.zongmu.gts.asset.repositories.AssetTagRepo;
import com.zongmu.gts.core.BusinessException;
import com.zongmu.gts.core.ErrorCode;
import com.zongmu.gts.core.UUIDGenerator;

@Service
public class AssetServiceImpl implements AssetService {

	private final static Logger LOGGER = LoggerFactory.getLogger(AssetServiceImpl.class);

	@Autowired
	private AssetRepo assetRepo;

	@Autowired
	private AssetFileRepo assetFileRepo;

	@Autowired
	private AssetTagRepo assetTagRepo;

	@Autowired
	private AssetTagItemRepo assetTagItemRepo;

	@Autowired
	private UUIDGenerator uuidGenerator;

	@Override
	public List<Asset> query() {
		return Lists.newArrayList(this.assetRepo.findAll());
	}

	@Transactional
	@Override
	public Asset save(CreateAssetParam createAssetParam) throws BusinessException {
		Asset asset = new Asset();
		asset.setName(createAssetParam.getName());
		asset.setAssetType(createAssetParam.getAssetType());
		asset.setAssetNo(this.uuidGenerator.generateNo());
		asset.setRecordTime(createAssetParam.getRecordTime());
		for (Long assetTagItemId : createAssetParam.getAssetTagItemIds()) {
			AssetTagItem assetTagItem = this.findAssetTagItem(assetTagItemId);
			asset.getAssetTagItems().add(assetTagItem);
		}
		return this.assetRepo.save(asset);
	}

	@Transactional
	@Override
	public AssetFile attchFile(String assetNo, AssetFile assetFile) throws BusinessException {
		Asset asset = this.findAsset(assetNo);
		assetFile.setAsset(asset);
		return this.assetFileRepo.save(assetFile);
	}

	@Override
	public List<AssetTag> findAllTags() throws BusinessException {
		return Lists.newArrayList(this.assetTagRepo.findAll());
	}

	@Transactional
	@Override
	public AssetTag createTag(AssetTag assetTag) throws BusinessException {
		return this.assetTagRepo.save(assetTag);
	}

	@Transactional
	@Override
	public AssetTag batchAddTagItems(Long assetTagId, List<String> tagItems) throws BusinessException {
		AssetTag assetTag = this.findAssetTag(assetTagId);
		for (String tagItem : tagItems) {
			this.createAssetTagItem(assetTag, tagItem);
		}

		boolean hasDefaultTagItem = this.assetTagItemRepo.hasDefaultTagItem(assetTag);
		if (!hasDefaultTagItem) {
			this.setFirstAssetTagItemDefault(assetTag);
		}
		assetTag = this.assetTagRepo.findOne(assetTagId);
		return assetTag;
	}

	@Transactional
	@Override
	public void setDefaultTagItem(Long assetTagItemId) throws BusinessException {
		AssetTagItem assetTagItem = this.findAssetTagItem(assetTagItemId);
		this.assetTagItemRepo.setTagItemDefault(assetTagItem.getAssetTag(), assetTagItemId);
		this.assetTagItemRepo.setOtherTagItemsDefault(assetTagItem.getAssetTag(), assetTagItemId);
	}

	@Transactional
	@Override
	public void deleteTagItem(Long assetTagItemId) throws BusinessException {
		AssetTagItem assetTagItem = this.findAssetTagItem(assetTagItemId);
		if (!assetTagItem.getAssets().isEmpty()) {
			LOGGER.error("Delete asset tag item ({}) failed, because it is used.", assetTagItemId);
			throw new BusinessException(ErrorCode.ASSET_TAG_NOT_FOUND);
		}

		if (assetTagItem.isDefault()) {
			this.setFirstAssetTagItemDefault(assetTagItem.getAssetTag());
		}

		this.assetTagItemRepo.delete(assetTagItem);
	}

	@Transactional
	@Override
	public void updateTagItem(Long assetTagItemId, String tagItemName) throws BusinessException {
		AssetTagItem assetTagItem = this.findAssetTagItem(assetTagItemId);
		if (StringUtils.isEmpty(tagItemName)) {
			LOGGER.error("Update asset tag item ({}) failed, because name is empty.", assetTagItemId);
			throw new BusinessException(ErrorCode.ASSET_TAG_NOT_FOUND);
		}

		assetTagItem.setName(tagItemName);
		this.assetTagItemRepo.save(assetTagItem);
	}

	private void setFirstAssetTagItemDefault(AssetTag assetTag) {
		this.assetTagItemRepo.setFirstTagItemDefault(assetTag.getId());
	}

	private void createAssetTagItem(AssetTag assetTag, String tagItemName) {
		if (!StringUtils.isEmpty(tagItemName)) {
			if (!this.assetTagItemRepo.exists(assetTag, tagItemName)) {
				AssetTagItem assetTagItem = new AssetTagItem();
				assetTagItem.setAssetTag(assetTag);
				assetTagItem.setName(tagItemName);
				this.assetTagItemRepo.save(assetTagItem);
			}
		}
	}

	private AssetTag findAssetTag(Long assetTagId) throws BusinessException {
		AssetTag assetTag = this.assetTagRepo.findOne(assetTagId);
		if (assetTag == null) {
			LOGGER.error("Asset tag ({}) not exists.", assetTagId);
			throw new BusinessException(ErrorCode.ASSET_TAG_NOT_FOUND);
		}

		return assetTag;
	}

	private AssetTagItem findAssetTagItem(Long assetTagItemId) throws BusinessException {
		AssetTagItem assetTagItem = this.assetTagItemRepo.findOne(assetTagItemId);
		if (assetTagItem == null) {
			LOGGER.error("Asset tag item ({}) not exists.", assetTagItemId);
			throw new BusinessException(ErrorCode.ASSET_TAG_NOT_FOUND);
		}

		return assetTagItem;
	}

	private Asset findAsset(String assetNo) throws BusinessException {
		Asset asset = this.assetRepo.findByAssetNo(assetNo);
		if (asset == null) {
			LOGGER.error("AssetNo ({}) not exists.", assetNo);
			throw new BusinessException(ErrorCode.ASSET_NOT_FOUND);
		}

		return asset;
	}

}
