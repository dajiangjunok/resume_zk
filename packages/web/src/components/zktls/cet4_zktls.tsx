'use client';

// https://dev.primuslabs.xyz/myDevelopment/myTemplates/detail?templateId=80af9bc9-af78-4186-82da-29554a31cbe2&name=CET-4/CET-6%20Score

import { useEffect, useState } from 'react';
import { PrimusZKTLS } from "@primuslabs/zktls-js-sdk";
import { Shield, ExternalLink } from 'lucide-react';

export default function Cet4ZktlsComponent() {
  const [status, setStatus] = useState('');

  const primusProof = async () => {
    try {
      // Initialize parameters
      const primusZKTLS = new PrimusZKTLS();
      const appId = "0x065c2d00883724443fc1bf7bfde331a77ceb7518";
      const appSecret = "0xb2d37671f937503635d50705f9b9ce28c4f6c11e6448fd31b2b909b42ba65b74"; // Just for testing
      
      setStatus('正在初始化...');
      const initAttestaionResult = await primusZKTLS.init(appId, appSecret);
      console.log("primusProof initAttestaionResult=", initAttestaionResult);
      
      // Set TemplateID and user address
      const attTemplateID = "80af9bc9-af78-4186-82da-29554a31cbe2";
      const userAddress = "0xb52C7c2a12AEDE7443A61d4B08339Eac8155Fa3E";
      
      setStatus('生成请求参数...');
      // Generate attestation request
      const request = primusZKTLS.generateRequestParams(attTemplateID, userAddress);

      // Set zkTLS mode
      const workMode = "proxytls";
      request.setAttMode({
        algorithmType: workMode,
      });

      setStatus('准备请求数据...');
      // Transfer request object to string
      const requestStr = request.toJsonString();

      setStatus('签名请求...');
      // Sign request
      const signedRequestStr = await primusZKTLS.sign(requestStr);

      setStatus('开始验证...');
      // 这里就是获取到四六级网站返回的数据，数据格式如下：
      const attestation = await primusZKTLS.startAttestation(signedRequestStr);
      // attestation.data 是 string 类型，需格式化为对象
      let attestationDataObj = {};
      if (attestation && typeof attestation.data === 'string') {
        try {
          attestationDataObj = JSON.parse(attestation.data);
          // 解析 attestationDataObj.data 字符串为对象
          let cetDataObj = {};
          if (attestationDataObj && typeof (attestationDataObj as any).data === 'string') {
            
            try {
              cetDataObj = JSON.parse((attestationDataObj as any).data);

              /**
               * cetDataObj 数据格式如下：
               * {
    "xm": "张三",
    "sfz": "身份证号",
    "list": [
        {
            "xm": "张三",
            "sfz": "身份证号",
            "xx": "xx大学",
            "zkzh": "准考证号",
            "score": "考试分数",
            "zsbh": "成绩报告单编号",
            "subject": "CET4",
            "exam_id": "3982",
            "exam": "2015年上半年",
            "tab": "CET4_151",
            "bkjb_code": "CET4",
            "is_down": 0
        }
    ],
    "total": 1
}
               */
             
              console.log("CET4 数据字符串：", (attestationDataObj as any).data);
            } catch (e) {
              console.error("CET4 data 字段解析失败：", e);
            }
          }
        } catch (e) {
          console.error("attestation.data 解析失败：", e);
        }
      }

      setStatus('验证签名...');
      // Verify signature
      const verifyResult = await primusZKTLS.verifyAttestation(attestation);
      console.log("verifyResult=", verifyResult);

      if (verifyResult === true) {
        setStatus('验证成功！');
      } else {
        setStatus('验证失败');
      }
    } catch (error) {
      console.error('ZKTLS验证过程出错:', error);
      setStatus('验证过程出错: ' + (error as Error).message);
    }
  };

  return (
    <button
      onClick={primusProof}
      className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-md text-xs hover:bg-primary/90 transition-colors"
    >
      <Shield className="w-3 h-3" />
      CET 4/6 级验证
      <ExternalLink className="w-3 h-3" />
    </button>
  );
}
