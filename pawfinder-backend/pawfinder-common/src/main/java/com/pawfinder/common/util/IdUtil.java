package com.pawfinder.common.util;

import cn.hutool.core.lang.Snowflake;
import cn.hutool.core.util.IdUtil;

/**
 * ID generation utility
 */
public class IdUtil {

    private static final Snowflake SNOWFLAKE = IdUtil.getSnowflake(1, 1);

    /**
     * Generate snowflake ID
     */
    public static String snowflakeId() {
        return String.valueOf(SNOWFLAKE.nextId());
    }

    /**
     * Generate UUID without dashes
     */
    public static String uuid() {
        return IdUtil.fastSimpleUUID();
    }
}
