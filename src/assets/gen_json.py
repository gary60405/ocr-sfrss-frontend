import json, os
from random import shuffle, randint

first = ['王', '李', '陳', '林', '吳', '鄭', '許', '周']
middle = ['小', '大']
last = ['明', '強', '婷', '均', '偉', '語']
image_dir = 'C:/test_pic/dist/2021-04-24/NCKU/'
filename = os.listdir(image_dir)

with open('src/assets/ase_corpus.txt', 'r+', encoding='utf-8') as f:
  keyword = f.read().split('\n')
  opt_list = []
  for i in range(10):
    shuffle(first)
    shuffle(middle)
    shuffle(last)
    shuffle(keyword)

    wordlist = list(map(lambda x: [x, randint(1, 100)], keyword[:60]))
    idxs = [ i for i in range(len(wordlist))]
    shuffle(idxs)

    opt_dict = {}
    opt_dict['name'] = f'{first[0]}{middle[0]}{last[0]}'
    opt_dict['id'] = randint(95000000, 98000000)
    opt_dict['computer_id'] = f'PC_{i + 1}'
    opt_dict['snapshot_date'] = f'2021-04-24'
    opt_dict['snapshot_time'] = f'16-1{i}-56'
    opt_dict['address'] = f'{image_dir}/{filename[i]}'
    opt_dict['keywords'] = [wordlist[idx] for idx in idxs[:20]]
    opt_dict['wordlist'] = wordlist
    opt_dict['rawtext'] = ''.join(map(lambda x: x[0], wordlist))
    opt_list.append(opt_dict)
  json.dump(opt_list, open('src/assets/userdata.json', 'w', encoding='utf-8'), ensure_ascii = False)

