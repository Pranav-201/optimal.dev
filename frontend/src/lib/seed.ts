import type { Day, SummaryEntry } from './types'

const blankApproach = (overrides: Partial<Day['problems'][number]['approaches']['optimal']> = {}) => ({
  language: 'JavaScript',
  code: '// Add your implementation here\n',
  timeComplexity: '',
  spaceComplexity: '',
  notes: '',
  ...overrides,
})

export const seedDays: Day[] = [
  {
    id: 'day-5',
    dayNumber: 5,
    date: '2026-08-10',
    problems: [
      {
        id: 'two-sum',
        title: 'Two Sum',
        difficulty: 'Easy',
        topic: 'Arrays & Hashing',
        timeSpentSec: 14 * 60 + 20,
        approaches: {
          brute: blankApproach({
            code: `function twoSum(nums, target) {\n  for (let i = 0; i < nums.length; i++) {\n    for (let j = i + 1; j < nums.length; j++) {\n      if (nums[i] + nums[j] === target) return [i, j];\n    }\n  }\n  return [];\n}`,
            timeComplexity: 'O(n^2)',
            spaceComplexity: 'O(1)',
            notes: 'Check every pair. Simple but slow for large inputs.',
          }),
          better: blankApproach({
            timeComplexity: 'O(n log n)',
            spaceComplexity: 'O(n)',
            notes: 'Sort with index tracking, then two-pointer scan.',
          }),
          optimal: blankApproach({
            code: `const twoSum = function(nums, target) {\n  // Create a map to store the value and its index\n  const map = new Map();\n\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n\n    map.set(nums[i], i);\n  }\n\n  return [];\n};`,
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(n)',
            notes: 'Used a hash map to store seen values and their indices. This allows for O(1) lookup time when checking if the complement exists, reducing the overall time complexity from O(n^2) in the brute force approach to O(n).',
          }),
        },
      },
      {
        id: 'lru-cache',
        title: 'LRU Cache',
        difficulty: 'Medium',
        topic: 'Linked List',
        timeSpentSec: 45 * 60 + 10,
        approaches: {
          brute: blankApproach({ timeComplexity: 'O(n)', spaceComplexity: 'O(n)', notes: 'Array-based store, linear search on every get/put.' }),
          better: blankApproach({ timeComplexity: 'O(1) avg', spaceComplexity: 'O(n)', notes: 'Map + manual ordering array — still O(n) on eviction.' }),
          optimal: blankApproach({
            code: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, val);\n    return val;\n  }\n\n  put(key, value) {\n    if (this.cache.has(key)) this.cache.delete(key);\n    else if (this.cache.size >= this.capacity) {\n      this.cache.delete(this.cache.keys().next().value);\n    }\n    this.cache.set(key, value);\n  }\n}`,
            timeComplexity: 'O(1)',
            spaceComplexity: 'O(capacity)',
            notes: 'JS Map preserves insertion order, so re-inserting on access naturally maintains recency without a manual doubly linked list.',
          }),
        },
      },
      {
        id: 'trapping-rain-water',
        title: 'Trapping Rain Water',
        difficulty: 'Hard',
        topic: 'Two Pointers',
        timeSpentSec: 32 * 60 + 5,
        approaches: {
          brute: blankApproach({ timeComplexity: 'O(n^2)', spaceComplexity: 'O(1)', notes: 'For each bar, scan left and right for max height.' }),
          better: blankApproach({ timeComplexity: 'O(n)', spaceComplexity: 'O(n)', notes: 'Precompute left-max and right-max arrays.' }),
          optimal: blankApproach({
            code: `function trap(height) {\n  let left = 0, right = height.length - 1;\n  let leftMax = 0, rightMax = 0, water = 0;\n\n  while (left < right) {\n    if (height[left] < height[right]) {\n      leftMax = Math.max(leftMax, height[left]);\n      water += leftMax - height[left];\n      left++;\n    } else {\n      rightMax = Math.max(rightMax, height[right]);\n      water += rightMax - height[right];\n      right--;\n    }\n  }\n  return water;\n}`,
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(1)',
            notes: 'Two pointers collapse inward, always processing the side with the smaller max — removes the need for auxiliary arrays.',
          }),
        },
      },
    ],
  },
  {
    id: 'day-9',
    dayNumber: 9,
    date: '2026-08-04',
    problems: [
      { id: 'valid-anagram', title: 'Valid Anagram', difficulty: 'Easy', topic: 'Arrays & Hashing', timeSpentSec: 600, approaches: { brute: blankApproach(), better: blankApproach(), optimal: blankApproach({ timeComplexity: 'O(n)', spaceComplexity: 'O(1)', notes: 'Character frequency count with a fixed-size array.' }) } },
      { id: 'contains-duplicate', title: 'Contains Duplicate', difficulty: 'Easy', topic: 'Arrays & Hashing', timeSpentSec: 420, approaches: { brute: blankApproach(), better: blankApproach(), optimal: blankApproach({ timeComplexity: 'O(n)', spaceComplexity: 'O(n)', notes: 'Set membership check while iterating.' }) } },
      { id: 'group-anagrams', title: 'Group Anagrams', difficulty: 'Medium', topic: 'Arrays & Hashing', timeSpentSec: 1380, approaches: { brute: blankApproach(), better: blankApproach(), optimal: blankApproach({ timeComplexity: 'O(n k log k)', spaceComplexity: 'O(n k)', notes: 'Sorted string as hashmap key groups anagrams together.' }) } },
      { id: 'top-k-frequent', title: 'Top K Frequent Elements', difficulty: 'Easy', topic: 'Heap / Bucket Sort', timeSpentSec: 900, approaches: { brute: blankApproach(), better: blankApproach(), optimal: blankApproach({ timeComplexity: 'O(n)', spaceComplexity: 'O(n)', notes: 'Bucket sort by frequency avoids full O(n log n) sort.' }) } },
    ],
  },
  {
    id: 'day-10',
    dayNumber: 10,
    date: '2026-08-05',
    problems: [
      { id: 'valid-parentheses', title: 'Valid Parentheses', difficulty: 'Medium', topic: 'Stack', timeSpentSec: 780, approaches: { brute: blankApproach(), better: blankApproach(), optimal: blankApproach({ timeComplexity: 'O(n)', spaceComplexity: 'O(n)', notes: 'Stack-based bracket matching.' }) } },
    ],
  },
  {
    id: 'day-11',
    dayNumber: 11,
    date: '2026-08-06',
    problems: [
      { id: 'binary-search', title: 'Binary Search', difficulty: 'Easy', topic: 'Binary Search', timeSpentSec: 480, approaches: { brute: blankApproach(), better: blankApproach(), optimal: blankApproach({ timeComplexity: 'O(log n)', spaceComplexity: 'O(1)', notes: 'Classic iterative mid-point narrowing.' }) } },
      { id: 'koko-bananas', title: 'Koko Eating Bananas', difficulty: 'Medium', topic: 'Binary Search', timeSpentSec: 1620, approaches: { brute: blankApproach(), better: blankApproach(), optimal: blankApproach({ timeComplexity: 'O(n log m)', spaceComplexity: 'O(1)', notes: 'Binary search over the answer space (eating speed).' }) } },
    ],
  },
  {
    id: 'day-12',
    dayNumber: 12,
    date: '2026-08-07',
    problems: [
      { id: 'climbing-stairs', title: 'Climbing Stairs', difficulty: 'Easy', topic: 'Dynamic Programming', timeSpentSec: 540, approaches: { brute: blankApproach(), better: blankApproach(), optimal: blankApproach({ timeComplexity: 'O(n)', spaceComplexity: 'O(1)', notes: 'Fibonacci-style bottom-up with two rolling variables.' }) } },
      { id: 'house-robber', title: 'House Robber', difficulty: 'Medium', topic: 'Dynamic Programming', timeSpentSec: 1140, approaches: { brute: blankApproach(), better: blankApproach(), optimal: blankApproach({ timeComplexity: 'O(n)', spaceComplexity: 'O(1)', notes: 'DP with two running maxima, no auxiliary array needed.' }) } },
      { id: 'word-break', title: 'Word Break', difficulty: 'Medium', topic: 'Dynamic Programming', timeSpentSec: 1500, approaches: { brute: blankApproach(), better: blankApproach(), optimal: blankApproach({ timeComplexity: 'O(n^2)', spaceComplexity: 'O(n)', notes: 'Bottom-up DP over substring break points.' }) } },
    ],
  },
]

export const seedSummaries: SummaryEntry[] = [
  {
    id: 'sum-aug-1-7',
    label: 'Aug 1–7 Summary',
    range: 'Days 1–7',
    cadence: 'Weekly',
    body: 'Strong focus on Binary Search implementations. Identified a recurring bug in calculating the mid-point which has now been resolved. Recommended next steps: transition to matrix-based graph problems to leverage current momentum.',
    createdAt: '2026-08-07',
  },
  {
    id: 'sum-jul-24-31',
    label: 'July 24–31 Summary',
    range: 'Days -6–0',
    cadence: 'Weekly',
    body: 'Consistent daily practice with an emphasis on array and hashing fundamentals. Two Sum variants solved comfortably; ready to layer in two-pointer techniques next cycle.',
    createdAt: '2026-07-31',
  },
]
