package com.zongmu.gts.asset;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Index;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.zongmu.gts.core.EntityModel;

@Entity
@Table(indexes = { @Index(name = "TAG_NAME_UNIQUE_INDEX", columnList = "asset_tag_id,name", unique = true) })
public class AssetTagItem extends EntityModel {

	@ManyToOne
	@JoinColumn(nullable = false)
	private AssetTag assetTag;

	@Column
	private String name;

	@Column
	private boolean isDefault;

	@JsonIgnore
	public AssetTag getAssetTag() {
		return assetTag;
	}

	public void setAssetTag(AssetTag assetTag) {
		this.assetTag = assetTag;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public boolean isDefault() {
		return isDefault;
	}

	public void setDefault(boolean isDefault) {
		this.isDefault = isDefault;
	}
}
