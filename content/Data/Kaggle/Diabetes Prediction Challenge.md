---
date: 2025-12-23
---

머신러닝을 공부해볼겸 kaggle의 Playground Competitions에 있는 [Diabetes Prediction Challenge](https://www.kaggle.com/competitions/playground-series-s5e12)에 참여해보았다. 대회 썸네일이 귀여워서 맘에 들었다. 

![[Diabetes Prediction Challenge-1766469645163.png]]

목표는 단순했다. 환자의 정보를 가진 테이블을 받아 환자의 **당뇨병 진단 확률을 예측**하는 것이었다.

![[Diabetes Prediction Challenge-1766468870713.png]]

## 첫번째 시도 (with. claude)

적용해보기 쉬운 랜덤포레스트 방식을 도전해봤고, 처음에는 AI에게 가이드를 부탁했다. 그래도 머신러닝의 기초는 가지고 있었기에, 나름 유의미해보이는 컬럼들을 feature로 설정해서 진행해보았다.

![[Diabetes Prediction Challenge-1766468999240.png]]

feature는 다음과 같이 나이, 흡연유무, 가족력, 주당 음주 횟수만 지정해봤다. 아직은 잘 모를 이런 저런 전처리 과정을 거쳐가며 첫번째 모델의 예측을 진행했다.

![[Diabetes Prediction Challenge-1766469099787.png]]

![[Diabetes Prediction Challenge-1766469138725.png]]

![[Diabetes Prediction Challenge-1766469152353.png]]
![[Diabetes Prediction Challenge-1766469184672.png]]

그래도 나름? 유의미한 feature로 학습을 했는제 62%의 정확도를 보여줬다. 그러나 feature별 중요도를 확인해보니 나이에만 의존한(?) 예측이 되어버린 것 같았다.

![[Diabetes Prediction Challenge-1766469243509.png]]

그래도 일단 나의 목적은 competition을 경험해보는 것이기 때문에, 해당 모델로 train 데이터 전부로 학습을 시켰고 test데이터를 predict 해봤다.

![[Diabetes Prediction Challenge-1766469363320.png]]

그렇게 submission.csv에 값을 입력하고 제출해보았다.

![[Diabetes Prediction Challenge-1766469409996.png]]

### 결과
![[Diabetes Prediction Challenge-1766469494532.png]]
점수는 0.51602 점이 나왔다. 제출은 무사히 되었지만 점수로는 3000명 중 2900등에 가까웠다. submission을 그대로 제출하는 것과 비슷한 수치였다. 이후 각 코드들의 역할에 대해 이해하고 조금은 개선된 두 번째 시도를 해봤다.

## 두번째 시도 (나름 혼자)

이번에는 id를 제외한 모든 컬럼을 feature로 설정해보았다. 

![[Diabetes Prediction Challenge-1766469765207.png]]

그리고 머신러닝을 하기 위해서는 **숫자로 된 데이터만 필요**하므로, 원-핫 인코딩이 필요한 컬럼을 데이터셋을 확인하여 찾아내었다.

![[Diabetes Prediction Challenge-1766469871374.png]]

그리고 **컬럼의 불일치를 방지**하기 위해 reindex도 진행해주었다.

![[Diabetes Prediction Challenge-1766469948017.png]]

이제 test_split을 통해 학습, 검증 데이터를 분리해주고, 랜덤포레스트 모델의 설정을 해주었다.

![[Diabetes Prediction Challenge-1766470015250.png]]

그렇게 생성된 모델을 통해 첫번째 predict를 진행해보았다.

![[Diabetes Prediction Challenge-1766470047084.png]]

첫 번째 시도에서 했던 것 보다 높은 66%의 정확도를 보여주었다. 그리고 이번에도 각 feature들이 얼마나의 중요도를 가지는지 확인해봤다.

![[Diabetes Prediction Challenge-1766470112732.png]]

이번에도 역시 **age는 높은 중요도를 가지지만, 가족이 당뇨병을 겪었었는지, 주마다 얼마나 운동을 하는 지의 수치가 더 큰 중요도를 가지고 있다**는 사실을 알 수 있었다. 이번에는 그럼 0.01 이상의 상위 중요도를 가진 feature들만 가지고 학습을 해보고 예측해보고 싶었다.

![[Diabetes Prediction Challenge-1766470218292.png]]

![[Diabetes Prediction Challenge-1766470240468.png]]

이번의 model2는 0.666의 정확도를 보여주었다. 아주 미세하게 더 정확해졌다. 이번에는 이 모델로 제출을 해보고자 train 전체 데이터를 통해 학습을 시키고 submission을 생성하여 제출했다.

### 결과
![[Diabetes Prediction Challenge-1766470521144.png]]

이번에는 0.60069점이 나왔다. 이전 기록보다 높아졌다고 축하도 해준다. 뭔가 그래도 competition의 개념에 대해 조금 배운 느낌이고, python을 다루는 것도 조금씩 익숙해지고 있는 것 같다.

---

**++두 번째 시도를 할 때, 에러가 발생했었다.**
![[Diabetes Prediction Challenge-1766470654842.png]]

이 코드 블럭에서 발생한 에러였는데, 에러 내용은 다음과 같았다.
```
ValueError                                Traceback (most recent call last)
/tmp/ipykernel_47/468994730.py in <cell line: 0>()
----> 1 submission['diagnosed_diabetes'] = test_predictions

/usr/local/lib/python3.11/dist-packages/pandas/core/frame.py in __setitem__(self, key, value)
   4309         else:
   4310             # set column
-> 4311             self._set_item(key, value)
   4312 
   4313     def _setitem_slice(self, key: slice, value) -> None:

/usr/local/lib/python3.11/dist-packages/pandas/core/frame.py in _set_item(self, key, value)
   4522         ensure homogeneity.
   4523         """
-> 4524         value, refs = self._sanitize_column(value)
   4525 
   4526         if (

/usr/local/lib/python3.11/dist-packages/pandas/core/frame.py in _sanitize_column(self, value)
   5264 
   5265         if is_list_like(value):
-> 5266             com.require_length_match(value, self.index)
   5267         arr = sanitize_array(value, self.index, copy=True, allow_2d=True)
   5268         if (

/usr/local/lib/python3.11/dist-packages/pandas/core/common.py in require_length_match(data, index)
    571     """
    572     if len(data) != len(index):
--> 573         raise ValueError(
    574             "Length of values "
    575             f"({len(data)}) "

ValueError: Length of values (700000) does not match length of index (300000)

```

에러의 핵심은 역시 마지막 줄 **Length of values (700000) does not match length of index (300000)** 이었다. submission은 300000의 크기를 가지고 있는데, 내가 넣고자 하는 values는 700000이라는 거였다. 왜 이런 일이 벌어졌을까 하고 코드를 올라가 보니, 

![[Diabetes Prediction Challenge-1766470823726.png]]

처음에 만든 test_X dataframe에 train의 데이터를 넣어 놓아서 생겼던 일이었다. 큰 오류는 아니어서 금방 고쳐내었지만, 조금 더 꼼꼼히 데이터를 확인하면서 진행해야 할 것 같다.

