DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_screen_name` varchar(100) NOT NULL,
  `user_tel_num` varchar(20) DEFAULT NULL,
  `user_email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_screen_name` (`user_screen_name`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8 COMMENT='用户表';

-- ----------------------------
-- Records of employee
-- ----------------------------
INSERT INTO `user_info` VALUES ('1', '张三', '13311111111', '111@163.com');
INSERT INTO `user_info` VALUES ('2', '李四', '13322222222', '222@21cn.com');
INSERT INTO `user_info` VALUES ('3', '王五', '13333333333', '333@yeah.net');
INSERT INTO `user_info` VALUES ('4', '刘六', '13344444444',  '444@sina.com.cn');
INSERT INTO `user_info` VALUES ('5', '郑七', '13355555555',  '555@tom.com');
INSERT INTO `user_info` VALUES ('6', '张三丰', '13366666666','666@xiyou.edu.cn');
INSERT INTO `user_info` VALUES ('7', '小赵', '13312345678', 'xiaozhao@163.com');
INSERT INTO `user_info` VALUES ('8', '小王', '13312345678', 'xiaowang@yeah.net');
INSERT INTO `user_info` VALUES ('9', '小田', '15712345678', 'xiaotian@sina.com.cn');
INSERT INTO `user_info` VALUES ('10', '小胡', '17812345678', 'xiaohu@tom.com');
INSERT INTO `user_info` VALUES ('11', '小钱', '15612345678', 'xiaoqian@yahoo.com.cn');
INSERT INTO `user_info` VALUES ('12', '老赵', '13312345678', 'laozhao@163.com');
INSERT INTO `user_info` VALUES ('13', '老王', '13312345678', 'laowang@yeah.net');
INSERT INTO `user_info` VALUES ('14', '老田', '15712345678', 'laotian@sina.com.cn');
INSERT INTO `user_info` VALUES ('15', '老胡', '17812345678', 'laohu@tom.com');
INSERT INTO `user_info` VALUES ('16', '老钱', '15612345678', 'laoqian@yahoo.com.cn');
INSERT INTO `user_info` VALUES ('17', '老章', '18710905922', 'laozhang@sohu.com');
INSERT INTO `user_info` VALUES ('18', '老周', '17812345678', 'laozhou@21cn.com');
INSERT INTO `user_info` VALUES ('19', '老刘', '18912345678', 'laoliu@126.com.cn');
INSERT INTO `user_info` VALUES ('20', '张欣瑶', '13377777777', 'zxy@163.com');
