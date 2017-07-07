package com.zongmu.gts.task;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.zongmu.gts.core.EntityModel;

@Entity
@Table
public class TaskItem extends EntityModel {

	@ManyToOne
	@JoinColumn(nullable = false)
	private Task task;

	@Column
	private String taskItemNo;

	@Column
	private int orderNo;

	@Column
	private TaskItemStatus status = TaskItemStatus.INIT;

	@JsonIgnore
	public Task getTask() {
		return task;
	}

	public void setTask(Task task) {
		this.task = task;
	}

	public String getTaskItemNo() {
		return taskItemNo;
	}

	public void setTaskItemNo(String taskItemNo) {
		this.taskItemNo = taskItemNo;
	}

	public int getOrderNo() {
		return orderNo;
	}

	public void setOrderNo(int orderNo) {
		this.orderNo = orderNo;
	}

	public TaskItemStatus getStatus() {
		return status;
	}

	public void setStatus(TaskItemStatus status) {
		this.status = status;
	}
}
