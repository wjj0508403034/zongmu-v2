package com.zongmu.gts.asset;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.zongmu.gts.core.EntityModel;

@Entity
@Table
public class AssetFile extends EntityModel {

	@ManyToOne
	@JoinColumn(nullable=false)
	private Asset asset;

	@Column
	private String assetFileNo;

	@Column
	private String fileName;

	@Column
	private String fileType;

	@Column
	private Long fileSize;

	@Column
	private int fps;

	@Column
	private float height;

	@Column
	private float width;

	@Column
	private float duration;

	@Column
	private Long frames;

	@JsonIgnore
	public Asset getAsset() {
		return asset;
	}

	public void setAsset(Asset asset) {
		this.asset = asset;
	}

	public String getAssetFileNo() {
		return assetFileNo;
	}

	public void setAssetFileNo(String assetFileNo) {
		this.assetFileNo = assetFileNo;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getFileType() {
		return fileType;
	}

	public void setFileType(String fileType) {
		this.fileType = fileType;
	}

	public Long getFileSize() {
		return fileSize;
	}

	public void setFileSize(Long fileSize) {
		this.fileSize = fileSize;
	}

	public int getFps() {
		return fps;
	}

	public void setFps(int fps) {
		this.fps = fps;
	}

	public float getHeight() {
		return height;
	}

	public void setHeight(float height) {
		this.height = height;
	}

	public float getWidth() {
		return width;
	}

	public void setWidth(float width) {
		this.width = width;
	}

	public float getDuration() {
		return duration;
	}

	public void setDuration(float duration) {
		this.duration = duration;
	}

	public Long getFrames() {
		return frames;
	}

	public void setFrames(Long frames) {
		this.frames = frames;
	}
}
