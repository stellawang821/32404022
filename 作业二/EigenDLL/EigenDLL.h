#pragma once

#ifdef EIGENDLL_EXPORTS
#define EIGEN_API __declspec(dllexport)
#else
#define EIGEN_API __declspec(dllimport)
#endif

extern "C" {
    // 生成随机矩阵 (返回指针需用free_matrix释放)
    EIGEN_API double* generate_random_matrix();

    // CPU特征值计算 (real和imag需预分配100长度数组)
    EIGEN_API void calculate_eigenvalues_cpu(double* matrix, double* real, double* imag);

    // GPU特征值计算 (返回计算时间ms)
    EIGEN_API double calculate_eigenvalues_gpu(double* matrix, double* real, double* imag);

    // 释放矩阵内存
    EIGEN_API void free_matrix(double* matrix);
}