
kaggle tutorial 진행 중
- https://www.kaggle.com/code/dansbecker/your-first-machine-learning-model

``` python 
from learntools.core import binder
binder.bind(globals())
from learntools.machine_learning.ex3 import *
from sklearn.tree import DecisionTreeRegressor
```

- 예측하고자 하는 값을 보통 y라고 합니다.
- 예측에 사용하고자 하는 Feature들을 x에 할당합니다.
- print(\_) 의 의미는?
- ``` python
  # Filter rows with missing price values 결측갑 필터링
filtered_melbourne_data = melbourne_data.dropna(axis=0)
  ```


![[exercise-your-first-machine-learning-model (1).ipynb]]

- **Mean Absolute Error** (also called **MAE**) 평균 절대 오차
	- MAE 지표를 사용하면 각 오차의 절댓값을 구합니다. 이를 통해 각 오차를 양수로 변환합니다. 그런 다음 이 절대 오차의 평균을 구합니다. 이것이 모델 품질을 측정하는 기준입니다.
- train_test_split 함수를 통해 데이터를 나누고, 일부는 학습데이터에, 일부는 평균절대오차를 계상하는 검증데이터로 사용합니다.
- 모델을 학습시킬 때 **같은 데이터로 학습하고 평가하면 안 되는 이유**가 있어요. 마치 학생이 시험 문제를 미리 보고 공부한 뒤 똑같은 문제로 시험을 보는 것과 같죠. 성적은 좋게 나오지만, 새로운 문제를 풀 수 있는 실력을 알 수 없어요.

그래서 데이터를 **학습용(training)**과 **검증용(validation)**으로 나눕니다.
- random_state란?

- Exercise: Model Validation
![[exercise-model-validation.ipynb]]
### Underfitting and Overfitting
