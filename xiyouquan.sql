-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `uid` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `user_tel` varchar(20) NOT NULL COMMENT '用户名',
  `screen_name` varchar(100) NOT NULL,
  `user_pass` varchar(20) NOT NULL DEFAULT '123456' COMMENT '密码',
  `user_header_img` varchar(500) DEFAULT NULL COMMENT '头像路径',
  PRIMARY KEY (`uid`),
  UNIQUE KEY `user_tel` (`user_tel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='登陆信息表';

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('000001','15510216093','张三', '123456', '');
INSERT INTO `user` VALUES ('000002','13311111117', '李四','123456', '');
INSERT INTO `user` VALUES ('000003','13311111116', '王五','123456', '');
INSERT INTO `user` VALUES ('000004','13311111115', '刘六','123456', '');
INSERT INTO `user` VALUES ('000005','13311111114', '郑七','123456', '');
INSERT INTO `user` VALUES ('000006','13311111113', '张三丰','123456', '');
INSERT INTO `user` VALUES ('000007','13311111112', '小赵','123456', '');
INSERT INTO `user` VALUES ('000008','13311111111', '小王','123456', '');
