package com.zongmu.gts.task;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.zongmu.gts.asset.Asset;
import com.zongmu.gts.core.EntityModel;

@Entity
@Table
public class Task extends EntityModel {

	@ManyToOne
	@JoinColumn(nullable = false)
	private Asset asset;

	@Column
	private String taskNo;

	@Column
	private String taskName;

	@Column
	private ShapeType shapeType;

	@Column
	private int sideCount;

	@Column
	private int videoCutInterval;

	@Column
	private String memo;

	@Column
	private boolean isTop;

	@Column
	private int priority = 3;

	@Column
	private boolean hide;

	public Asset getAsset() {
		return asset;
	}

	public void setAsset(Asset asset) {
		this.asset = asset;
	}

	public String getTaskNo() {
		return taskNo;
	}

	public void setTaskNo(String taskNo) {
		this.taskNo = taskNo;
	}

	public String getTaskName() {
		return taskName;
	}

	public void setTaskName(String taskName) {
		this.taskName = taskName;
	}

	public ShapeType getShapeType() {
		return shapeType;
	}

	public void setShapeType(ShapeType shapeType) {
		this.shapeType = shapeType;
	}

	public int getSideCount() {
		return sideCount;
	}

	public void setSideCount(int sideCount) {
		this.sideCount = sideCount;
	}

	public int getVideoCutInterval() {
		return videoCutInterval;
	}

	public void setVideoCutInterval(int videoCutInterval) {
		this.videoCutInterval = videoCutInterval;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public int getPriority() {
		return priority;
	}

	public void setPriority(int priority) {
		this.priority = priority;
	}

	public boolean isTop() {
		return isTop;
	}

	public void setTop(boolean isTop) {
		this.isTop = isTop;
	}

	public boolean isHide() {
		return hide;
	}

	public void setHide(boolean hide) {
		this.hide = hide;
	}

}
