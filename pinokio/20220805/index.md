@Yura Hwang (황유라) 안녕하세요. 가입 후 읽기만 하다가 처음으로 메시지를 작성하게 됐습니다. 저희 플로트릭에서는 길건너 친구들 풍의 경주 게임을 개발하고 있고, 최근에 C# 프로토타입을 제페토 스크립트로 옮기는 작업을 시작했습니다. 그런데 가이드 문서에서 제공하는 단일 에셋 생성/할당 샘플을 응용해서 ZepetoScriptableObject 를 목록으로 할당하고자 했으나 잘 되지 않았습니다.

1. 참고한 가이드 문서 : https://studio.zepeto.me/guides/scriptableobject
2. 에셋 코드 : https://github.com/plotrick/zpt_study/blob/main/pinokio/20220805/VehicleData.ts
3. 게임오브젝트 코드 : https://github.com/plotrick/zpt_study/blob/main/pinokio/20220805/AppSettings.ts

관련하여 제가 시도해본 것은 이렇습니다: (인스펙터 스크린샷을 첨부했습니다.)

1. `@SerializeField() private vehicles : ZepetoScriptableObject<VehicleData>[];` -- (현재) 인스펙터에 필드가 노출되나, 바로 밑에  vehicles editor is has error. 문구가 출력됨; 에셋 할당 불가.
2. `public vehicles : ZepetoScriptableObject<VehicleData>[];` -- 아예 인스펙터에 필드가 노출되지 않음.
3. `public vehicles : ZepetoScriptableObject[];` -- 1번 항목과 동일.

이 이슈를 어떻게 해결하면 좋을까요? 혹은, 제가 간과한 부분이 있을까요?
