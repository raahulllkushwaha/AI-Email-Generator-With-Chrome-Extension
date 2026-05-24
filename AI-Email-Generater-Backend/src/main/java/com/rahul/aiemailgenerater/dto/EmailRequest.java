package com.rahul.aiemailgenerater.dto;

import lombok.Data;

@Data
public class EmailRequest {
    private String emailContent;
    private String tone;

}
