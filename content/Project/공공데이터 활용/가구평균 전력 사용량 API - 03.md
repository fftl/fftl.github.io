---
created: 2026-02-04T23:19:06+09:00
modified: 2026-02-17T18:11:14+09:00
---
## 이 글에서 다룰 것
---
- 새로운 데이터 확인 및 수집 dag 만들기

## dag 만들기
---
먼저 dag를 1차적으로 완성한 지금 시점에서 정리를 해보도록 하겠습니다.
```python
def get_items(**context):
    """데이터를 수집 합니다."""
    find_list = check_new_data()

    # 새로 추가된 데이터가 없다면
    if not find_list:
        return False
    
    else:
        for date in find_list:
            try_count = 0
            fail_list = []
            year, month = date[0], date[1]

            while try_count < 10:
                if try_count == 0:
                    for r in region:
                        region_code = r[:2]
                        params = {
                            'year' : year,
                            'month' : f'{month:02d}',
                            'metroCd' : region_code,
                            'apiKey' : Variable.get("ELECTRIC_API_KEY")
                        }

                        try:
                            response = requests.get(url, params=params, timeout=5)
                            response.raise_for_status()
                            result = response.json()

                            #row_data에는 제외되어 있는 지역코드를 추가해줍니다.
                            if 'data' in result and result['data']:
                                for data in result['data'] :
                                    data['sd_code'] = region_code

                                #convert_input함수를 통해 dict 리스트의 형태를 테이블과 맞도록 변형해주었습니다.
                                convert_data = [convert_input(d) for d in result['data']]
                                # print(f"{year}-{month:02d} {region_code}: {len(result['data'])}건 입력됨")
                                save_batch(convert_data)  # Raw SQL로 저장
                                    
                        except Exception as e:
                            print(f"✗ {year}-{month:02d} {region_code}: {type(e).__name__}")
                            fail_list.append([year, f'{month:02d}', region_code])
                        
                elif fail_list:
                    new_fail_list = []  # ← 새로운 실패 목록
                    for f in fail_list:
                        params = {
                                'year' : f[0],
                                'month' : f[1],
                                'metroCd' : f[2],
                                'apiKey' : Variable.get("ELECTRIC_API_KEY")
                            }

                        try:
                            response = requests.get(url, params=params, timeout=5)
                            response.raise_for_status()
                            result = response.json()

                            #row_data에는 제외되어 있는 지역코드를 추가해줍니다.
                            if 'data' in result and result['data']:
                                for data in result['data'] :
                                    data['sd_code'] = f[2]

                                #convert_input함수를 통해 dict 리스트의 형태를 테이블과 맞도록 변형해주었습니다.
                                convert_data = [convert_input(d) for d in result['data']]
                                # print(f"{year}-{month:02d} {region_code}: {len(result['data'])}건 입력됨")
                                save_batch(convert_data)  # Raw SQL로 저장
                                    
                        except Exception as e:
                            print(f"✗ {year}-{month:02d} {region_code}: {type(e).__name__}")
                            new_fail_list.append([year, f'{month:02d}', region_code])
                    fail_list = new_fail_list  # ← 업데이트
                else:
                    break

                try_count += 1

            if fail_list:
                save_failed_items_to_file(fail_list)
```




