package com.pgverse.dto;

import java.sql.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString(callSuper = true)
public class ReviewRespDTO {
	
	private int rating;
	private String comment;
	private Date feedbackDate;
	private Long userid;
	private String userName;
	private Long pgPropertyid;
	private String pgPropertyName;
	
}
