#include "EigenDLL.h"
#include <cstdio>        // ���fprintf֧��
#include <cstdlib>       // ���exit֧��
#include <cuda_runtime.h>
#include <cusolverDn.h>  // cuSOLVER��Ҫͷ�ļ�
#include <chrono>

#define CUDA_CHECK(fn) { \
    cudaError_t err = (fn); \
    if (err != cudaSuccess) { \
        fprintf(stderr, "CUDA error [%s:%d]: %s\n", __FILE__, __LINE__, cudaGetErrorString(err)); \
        exit(EXIT_FAILURE); \
    } \
}

#define CUSOLVER_CHECK(fn) { \
    cusolverStatus_t status = (fn); \
    if (status != CUSOLVER_STATUS_SUCCESS) { \
        fprintf(stderr, "cuSOLVER error [%s:%d]: %d\n", __FILE__, __LINE__, (int)status); \
        exit(EXIT_FAILURE); \
    } \
}

extern "C" {
    double calculate_eigenvalues_gpu(double* matrix, double* real, double* imag) {
        auto start = std::chrono::high_resolution_clock::now();

        cusolverDnHandle_t handle;
        CUSOLVER_CHECK(cusolverDnCreate(&handle));

        // �豸�ڴ����
        double* d_matrix, * d_real, * d_imag;
        int* d_info;
        CUDA_CHECK(cudaMalloc((void**)&d_matrix, 10000 * sizeof(double)));
        CUDA_CHECK(cudaMalloc((void**)&d_real, 100 * sizeof(double)));
        CUDA_CHECK(cudaMalloc((void**)&d_imag, 100 * sizeof(double)));
        CUDA_CHECK(cudaMalloc((void**)&d_info, sizeof(int)));

        // �������ݵ��豸
        CUDA_CHECK(cudaMemcpy(d_matrix, matrix, 10000 * sizeof(double), cudaMemcpyHostToDevice));

        // ���㹤���ռ�
        int lwork;
        CUSOLVER_CHECK(cusolverDnDgeev_bufferSize(
            handle,
            CUSOLVER_EIG_MODE_NOVECTOR,
            100,
            d_matrix,
            100,
            d_real,
            d_imag,
            nullptr,
            100,
            nullptr,
            100,
            &lwork
        ));

        double* d_work;
        CUDA_CHECK(cudaMalloc((void**)&d_work, lwork * sizeof(double)));

        // ��������ֵ
        CUSOLVER_CHECK(cusolverDnDgeev(
            handle,
            CUSOLVER_EIG_MODE_NOVECTOR,
            100,
            d_matrix,
            100,
            d_real,
            d_imag,
            nullptr,
            100,
            nullptr,
            100,
            d_work,
            lwork,
            d_info
        ));

        // ���ƽ��������
        CUDA_CHECK(cudaMemcpy(real, d_real, 100 * sizeof(double), cudaMemcpyDeviceToHost));
        CUDA_CHECK(cudaMemcpy(imag, d_imag, 100 * sizeof(double), cudaMemcpyDeviceToHost));

        // ������Դ
        cudaFree(d_matrix);
        cudaFree(d_real);
        cudaFree(d_imag);
        cudaFree(d_info);
        cudaFree(d_work);
        cusolverDnDestroy(handle);

        auto end = std::chrono::high_resolution_clock::now();
        std::chrono::duration<double> diff = end - start;
        return diff.count() * 1000; // ���غ���
    }
}