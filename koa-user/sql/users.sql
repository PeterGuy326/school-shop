CREATE TABLE `Users` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id自增',
  `wx_id` varchar(32) NOT NULL COMMENT '微信号',
  `school_id` int(11) NOT NULL DEFAULT 0 COMMENT '学校id',
  `phone` varchar(32) NOT NULL DEFAULT '' COMMENT '手机号',
  `deleted_at` int(1) DEFAULT '0' COMMENT '1 为已经删除, 0 为未删除',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;
ALTER TABLE `Users` ADD unique(`uid`);