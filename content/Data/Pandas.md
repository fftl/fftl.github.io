## scv 데이터 추출

``` python
import pandas as pd

abc_file_path = '../input/abc.csv'
abc_data = pd.read_csv(abc_file_path) 

abc_data.describe() 
#summary 가능

abc_data.columns 
#column만 추출

abc_data.shape
#row 개수, 컬럼 개수를 각각 출력함
```

## 원-핫 인코딩
타입과 같이 공통으로 가지고 있을만한 컬럼을 문자열 형태가 아니라 숫자로 변환합니다.

예를들어 smoking_status 가 가질 수 있는 값이 Current, Former, Never  이렇게 흡연중, 이전에 흡연, 펴본적 없음으로 세가지 가지고 있다면 기존에는
![[Pandas-1766459229197.png]]

위와 같이 각각을 문자열 형태로 가지고 있습니다. 하지만 머신러닝 모델은 숫자만 이해할 수 있기 때문에, 숫자를 통해 이를 표현해주어야 합니다. boolean과 같은 값을 통해서 말이죠. 그럴 때 [get_dummies()](https://pandas.pydata.org/docs/reference/api/pandas.get_dummies.html)를 사용할 수 있습니다.

```python
X_train = pd.get_dummies(X_train_raw, columns=['smoking_status'], drop_first=False)
```

위와 같이 get_dummies(dataframe, columns, drop_first)를 이용하면 아래와 같이, 선택할 수 있는 타입을 이용해 컬럼을 만들고 각각에 대해 boolean을 통해 표현해주게 됩니다.
![[Pandas-1766459516670.png]]

여기서 각각의 dataframe과 columns는 파라미터 이름으로 유추가 가능하지만 drop_first의 경우는 이해하기 어려울 수 있어 설명해봅니다. 만약 해당 drop_first를 True로 한다면 아래와 같이 두 개의 컬럼으로만 분리되게 됩니다.![[Pandas-1766459746784.png]]

그 이유는 두 개의 컬럼만 있더라도 firstColumn으로 올 예정이었던 smoking_status_Current의 값을 유추할 수 있기 때문입니다. 데이터가 잘 들어있다면, 나머지 두 값이 False, False라면 Current의 값은 True라는 것을 유추할 수 있기 때문입니다.

> drop_first로 삭제될 컬럼은 생성될 수 있는 타입들을 이름순으로 정렬했을 때, 첫번째 오는 요소라고 합니다. 그래서 Current가 제거됩니다.


