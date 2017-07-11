package com.zongmu.gts.asset.controller;

import java.util.ArrayList;
import java.util.List;

import org.joda.time.DateTime;

import com.zongmu.gts.asset.AssetType;

public class CreateAssetParam {

	private String name;
	private DateTime recordTime;
	private AssetType assetType;
	private List<Long> assetTagItemIds = new ArrayList<>();

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public DateTime getRecordTime() {
		return recordTime;
	}

	public void setRecordTime(DateTime recordTime) {
		this.recordTime = recordTime;
	}

	public AssetType getAssetType() {
		return assetType;
	}

	public void setAssetType(AssetType assetType) {
		this.assetType = assetType;
	}

	public List<Long> getAssetTagItemIds() {
		return assetTagItemIds;
	}

	public void setAssetTagItemIds(List<Long> assetTagItemIds) {
		this.assetTagItemIds = assetTagItemIds;
	}

}
