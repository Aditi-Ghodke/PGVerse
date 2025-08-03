package com.pgverse.dto;

import java.util.List;

import com.pgverse.entities.PgType;

import ch.qos.logback.core.status.Status;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PGRoomResponseDTO {
	 private Long pgId;
	    private String name;
	    private String location;
	    private PgType pgType;
	    private Status status;
	    private String description;
	    private Long ownerid;
	    private String ownername;
	    private String imagePath;

	    private List<RoomRespDTO> rooms;
}
