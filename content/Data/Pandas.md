``` python
import pandas as pd

abc_file_path = '../input/abc.csv'
abc_data = pd.read_csv(abc_file_path) 
abc_data.describe() #summary 가능
abc_data.columns #column만 추출
```