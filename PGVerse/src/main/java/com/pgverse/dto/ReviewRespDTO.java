package com.pgverse.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString(callSuper = true)
public class ReviewRespDTO {
	
	private int rating;
	private String comment;
	private LocalDate feedbackDate;
	private Long userId;;
	private String userName;
	private Long pgPropertyid;
	private String pgPropertyName;
	
}