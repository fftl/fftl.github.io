---
date: 2025-12-27
---


kaggle Intro to Machine Learning 진행 중
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

## Mean Absolute Error (also called **MAE**) 평균 절대 오차
	- MAE 지표를 사용하면 각 오차의 절댓값을 구합니다. 이를 통해 각 오차를 양수로 변환합니다. 그런 다음 이 절대 오차의 평균을 구합니다. 이것이 모델 품질을 측정하는 기준입니다.
- train_test_split 함수를 통해 데이터를 나누고, 일부는 학습데이터에, 일부는 평균절대오차를 계상하는 검증데이터로 사용합니다.
- 모델을 학습시킬 때 **같은 데이터로 학습하고 평가하면 안 되는 이유**가 있어요. 마치 학생이 시험 문제를 미리 보고 공부한 뒤 똑같은 문제로 시험을 보는 것과 같죠. 성적은 좋게 나오지만, 새로운 문제를 풀 수 있는 실력을 알 수 없어요.

그래서 데이터를 **학습용(training)**과 **검증용(validation)**으로 나눕니다.
- random_state의 의미?

- Exercise: Model Validation
![[exercise-model-validation.ipynb]]
## Underfitting and Overfitting
- 과소적합, 과대적합
- 과소적합
	- 학습의 깊이가 너무 얕아서 데이터의 중요한 차이점과 패턴을 포착하지 못하는 경우
- 과대적합
	- 학습의 깊이가 너무 깊어서 훈련된 데이터에는 좋은 성능이지만, 새로운 데이터에는 쉽게 예측하지 못하는 경우
- 이를 방지하기 위한 max_leaf_nodes 인수를 설정하는 방법이 있습니다.
- ```python
  from sklearn.metrics import mean_absolute_error
from sklearn.tree import DecisionTreeRegressor

def get_mae(max_leaf_nodes, train_X, val_X, train_y, val_y):
    model = DecisionTreeRegressor(max_leaf_nodes=max_leaf_nodes, random_state=0)
    model.fit(train_X, train_y)
    preds_val = model.predict(val_X)
    mae = mean_absolute_error(val_y, preds_val)
    return(mae)
  ```

```python
# compare MAE with differing values of max_leaf_nodes
for max_leaf_nodes in [5, 50, 500, 5000]:
    my_mae = get_mae(max_leaf_nodes, train_X, val_X, train_y, val_y)
    print("Max leaf nodes: %d  \t\t Mean Absolute Error:  %d" %(max_leaf_nodes, my_mae))
```

위와 같이 설정 해놓은 max_leaf_nodes의 값에 따른 예측값을 각각 확인할 수 있습니다.

#### 결론
요점은 다음과 같습니다. 모델은 다음 중 하나에 시달릴 수 있습니다.  
  
- **과대적합**: 미래에 반복되지 않을 허위 패턴을 포착하여 덜 정확한 예측으로 이어집니다.  
- **과소적합**: 관련 패턴을 포착하지 못하여 다시 정확도가 떨어지는 예측으로 이어집니다.  
후보 모델의 정확도를 측정하기 위해 모델 학습에 사용되지 않는 검증 데이터를 사용합니다. 이를 통해 우리는 많은 후보 모델을 시도하고 가장 좋은 모델을 유지할 수 있습니다.

## [[Random Forests]]
데이터가 거의 없는 경우 학습을 시키더라도 성능이 좋기 힘듭니다. 그럴때 Random Forest를 이용합니다.

RandomForestRegressor를 이용해 RandomForest 모델을 구축합니다.
```python
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error

forest_model = RandomForestRegressor(random_state=1)
forest_model.fit(train_X, train_y)
melb_preds = forest_model.predict(val_X)
print(mean_absolute_error(val_y, melb_preds))
```

kaggle의 따라하기를 완료하여 첫 submit을 해봤다!
![[Data analytics-1765381098538.png]]