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

    # .speaker-name의 font-weight를 700으로 변경
    content = re.sub(
        r'(\.speaker-name\s*\{[^}]*font-weight:\s*)600',
        r'\1700',
        content
    )

    # .speaker-title의 font-weight를 700으로 변경
    content = re.sub(
        r'(\.speaker-title\s*\{[^}]*font-weight:\s*)600',
        r'\1700',
        content
    )

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✓ {filename} 강사 이름/소속 더 굵게 수정 완료")

print("\n모든 파일 수정 완료!")
