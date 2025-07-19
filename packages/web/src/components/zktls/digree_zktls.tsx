'use client';

// https://dev.primuslabs.xyz/myDevelopment/myTemplates/detail?templateId=38396d71-242d-49da-a1aa-0affc3f70e19&name=Degree%20Information

import { useEffect, useState } from 'react';
import { PrimusZKTLS } from "@primuslabs/zktls-js-sdk";
import { Shield, ExternalLink } from 'lucide-react';

export default function DegreeZktlsComponent() {
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
      const attTemplateID = "38396d71-242d-49da-a1aa-0affc3f70e19";
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
      // 这里就是获取到的数据和值
      const attestation = await primusZKTLS.startAttestation(signedRequestStr);
      console.log("attestation=", attestation);




      

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
      // 弹窗显示消息
      if (verifyResult === true) {
        alert('学历验证成功！');
      } else {
        alert('学历验证失败，请重试。');
      }
    }
  };

  return (
    <button
      onClick={primusProof}
      className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-md text-xs hover:bg-primary/90 transition-colors"
    >
      <Shield className="w-3 h-3" />
      学信网验证
      <ExternalLink className="w-3 h-3" />
    </button>
  );
}
