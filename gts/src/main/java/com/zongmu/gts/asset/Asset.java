package com.zongmu.gts.asset;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;

import org.joda.time.DateTime;

import com.zongmu.gts.core.EntityModel;

@Entity
@Table
public class Asset extends EntityModel {

	@Column
	private String name;

	@Column
	private String assetNo;

	@Column
	private DateTime recordTime;

	@Column
	private AssetType assetType;

	@OneToMany(mappedBy = "asset", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
	@OrderBy("id ASC")
	private final List<AssetFile> files = new ArrayList<>();

	@ManyToMany
	@JoinTable
	private List<AssetTagItem> assetTagItems = new ArrayList<>();

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAssetNo() {
		return assetNo;
	}

	public void setAssetNo(String assetNo) {
		this.assetNo = assetNo;
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

	public List<AssetTagItem> getAssetTagItems() {
		return assetTagItems;
	}

	public void setAssetTagItems(List<AssetTagItem> assetTagItems) {
		this.assetTagItems = assetTagItems;
	}

	public List<AssetFile> getFiles() {
		return files;
	}
}
