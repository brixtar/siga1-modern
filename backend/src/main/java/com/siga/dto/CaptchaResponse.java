package com.siga.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CaptchaResponse {
    private String captchaId;
    private String captchaImage;
    private long expiresInSeconds;
}
