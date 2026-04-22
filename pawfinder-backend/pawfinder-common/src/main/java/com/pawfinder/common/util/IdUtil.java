package com.pawfinder.common.util;

import cn.hutool.core.lang.Snowflake;
import cn.hutool.core.util.RandomUtil;

/**
 * ID generation utility
 */
public class IdUtil {

    private static final Snowflake SNOWFLAKE = cn.hutool.core.util.IdUtil.getSnowflake(1, 1);

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
        return cn.hutool.core.util.IdUtil.fastSimpleUUID();
    }

    /**
     * Generate random numbers with specified length
     */
    public static String randomNumbers(int length) {
        return RandomUtil.randomNumbers(length);
    }
}
