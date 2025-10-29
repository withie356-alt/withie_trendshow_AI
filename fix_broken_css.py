# -*- coding: utf-8 -*-
import re
import os
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# 파일 목록
files = [
    'page_윤송이.html',
    'page_김대식.html',
    'page_송길영.html',
    'page_오건영.html',
    'page_손재권.html',
    'page_김미경.html',
    'page_하형석.html',
    'page_이주환.html',
    'page_이나래.html'
]

for filename in files:
    if not os.path.exists(filename):
        print(f"파일을 찾을 수 없습니다: {filename}")
        continue

    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # x0으로 깨진 부분을 원래대로 복구
    # .speaker-name 복구
    content = re.sub(
        r'x0;\s*margin-bottom: 8px;\s*}',
        '''.speaker-name {
            font-size: 24px;
            font-weight: 400;
            margin-bottom: 8px;
        }''',
        content
    )

    # .topic 복구
    content = re.sub(
        r'x0;\s*margin-top: 15px;\s*line-height: 1\.4;\s*}',
        '''.topic {
            font-size: 28px;
            font-weight: 700;
            margin-top: 15px;
            line-height: 1.4;
        }''',
        content
    )

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✓ {filename} CSS 복구 완료")

print("\n모든 파일 복구 완료!")
